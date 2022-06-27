import { Block } from "../../types/block";

export type BlockConnection = {
  from: Block;
  to: Block;
  sequenceItHasBeenAddedConsideringEquals: number;
}

export type DependencySolvingScenario = {
  sequence: number,
  blockConnections: BlockConnection[]
}