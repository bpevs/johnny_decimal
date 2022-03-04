export interface Command {
  name: string;
  alias?: string[];
  description?: string;
  helpText?: string;
  (...args: any[]): any;
}
