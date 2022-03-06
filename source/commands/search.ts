import { Directory } from "../models/directory.ts";

export default async function search(this: Directory, [str]: string[]) {
  const locations = await this.findLocationsByName(str);

  locations.forEach((location) => {
    console.log(location.name);
  });
}
