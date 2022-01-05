import type { ListrContext } from "listr2";
import type { Task } from "listr2/dist/lib/task";
import { DefaultRenderer } from "listr2/dist/renderer/default.renderer";
import logUpdate from "log-update";

import { colors } from "./colors";
import { Glyphs, Spinner } from "./glyphs";

/**
 * @module Renderer
 *
 * This [Listr Renderer](https://listr2.kilic.dev/renderers/introduction)
 * is a *slightly* modified version of Listr(2)'s [`DefaultRenderer`](https://listr2.kilic.dev/renderers/default-renderer).
 */

// @ts-expect-error JavaScript allows private method overriding, TypeScript does not.
export class Renderer extends DefaultRenderer {
  private id?: NodeJS.Timeout;
  private spinnerPosition = 0;

  constructor(
    tasks: Task<any, typeof DefaultRenderer>[],
    options: typeof DefaultRenderer["rendererOptions"],
    renderHook$?: Task<any, any>["renderHook$"]
  ) {
    super(tasks, options, renderHook$);
    this.options = { ...DefaultRenderer.rendererOptions, ...this.options };
  }

  public render(): void {
    // Do not render if we are already rendering
    if (this.id) {
      return;
    }

    const updateRender = (): void => logUpdate(this.createRender());

    /* istanbul ignore if */
    if (!this.options?.lazy) {
      this.id = setInterval(() => {
        this.spinnerPosition = ++this.spinnerPosition % Spinner.length;
        updateRender();
      }, 100);
    }

    this.renderHook$?.subscribe(() => {
      updateRender();
    });
  }

  private getSymbol(
    task: Task<ListrContext, typeof DefaultRenderer>,
    data = false
  ): string {
    if (task.isPending() && !data) {
      return this.options?.lazy ||
        (this.getSelfOrParentOption(task, "showSubtasks") !== false &&
          task.hasSubtasks() &&
          !task.subtasks.every((subtask) => !subtask.hasTitle()))
        ? colors.rw.light(Glyphs.pointer)
        : colors.rw.light(Spinner[this.spinnerPosition]);
    } else if (task.isCompleted() && !data) {
      return task.hasSubtasks() &&
        task.subtasks.some((subtask) => subtask.hasFailed())
        ? colors.warning(Glyphs.warning)
        : colors.success(Glyphs.tick);
    } else if (task.isRetrying() && !data) {
      return this.options?.lazy
        ? colors.warning(Glyphs.warning)
        : colors.rw.light(Spinner[this.spinnerPosition]);
    } else if (task.isRollingBack() && !data) {
      return this.options?.lazy
        ? colors.warning(Glyphs.warning)
        : colors.warning(Spinner[this.spinnerPosition]);
    } else if (task.hasRolledBack() && !data) {
      return colors.error(Glyphs.arrowLeft);
    } else if (task.hasFailed() && !data) {
      return task.hasSubtasks()
        ? colors.error(Glyphs.pointer)
        : colors.error(Glyphs.cross);
    } else if (
      task.isSkipped() &&
      !data &&
      this.getSelfOrParentOption(task, "collapseSkips") === false
    ) {
      return colors.warning(Glyphs.warning);
    } else if (
      task.isSkipped() &&
      (data || this.getSelfOrParentOption(task, "collapseSkips"))
    ) {
      return colors.struc(Glyphs.arrowDown);
    }

    return !data ? colors.struc(Glyphs.squareSmallFilled) : Glyphs.pointer;
  }
}
