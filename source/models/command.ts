import { Directory } from "./directory.ts";

/**
 * @interface Command
 * @description An action that a Johnny Decimal Directory can take
 *
 * @property name - The name used to invoke and reference a command
 * @property description - Description of what a command does
 * @property usage - Description of how a command is invoked
 * @property alias - A list of other names that can be used to invoke a command
 * @property fn - The functionality of a command. Bound to the Directory.
 */
export interface Command {
  name: string;
  description?: string;
  usage?: string;
  alias?: string[];
  fn: (this: Directory, args?: string[]) => Promise<any>;
}
