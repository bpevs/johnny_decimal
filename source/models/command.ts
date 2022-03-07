export interface Command {
  name: string = "";
  description?: string;
  usage?: string;
  alias?: string[] = [];
  // fn: (this: Directory, args: string[]) => Promise<any>;
}
