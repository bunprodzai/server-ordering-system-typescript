declare module "mongoose-slug-updater" {
  import { Schema } from "mongoose";

  interface SlugOptions {
    slugPaddingSize?: number;
    symbols?: boolean;
    separator?: string;
    [key: string]: any;
  }

  function slugUpdater(schema: Schema, options?: SlugOptions): void;

  export = slugUpdater;
}
