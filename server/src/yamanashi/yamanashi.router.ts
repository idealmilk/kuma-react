import express, { Request, Response } from "express";
import * as ItemService from "./yamanashi.service";
import { Sightings } from "./sightings.interface";

export const yamanashiRouter = express.Router();

yamanashiRouter.get("/", async (req: Request, res: Response) => {
  try {
    const items: Sightings = await ItemService.findAll();

    res.status(200).send(items);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});
