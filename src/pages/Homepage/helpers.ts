import { Block, equals } from "../../types/block";
import { BlockPosition } from "../../types/blockPosition";
import { Position } from "../../types/position";
import { BlockConnection, DependencySolvingScenario } from "./types";

type ProcessNeedList = {
  block: Block,
  needs: Block[],
}

type ResourceDispositionList = {
  block: Block,
  isAvailableTo: Block[],
}

const processNeedLists: ProcessNeedList[] = [];
const resourceDispositionLists: ResourceDispositionList[] = [];

export const isBlockWaitingSelection = (block: Block, blockInEdition: Block | undefined): boolean => {
  if (blockInEdition === undefined) return false
  
  if (equals(block, blockInEdition)) return false
  
  if (blockInEdition.type === block.type) return false

  return true
}

export const getPosition = (block: Block, blocksPosition: BlockPosition[]): Position => {
  const blockPosition = blocksPosition.find(blockPos => (blockPos.block.id === block.id) && (blockPos.block.type === block.type));

  if (blockPosition != null) {
    return blockPosition.position;
  }

  return { top: 50, left: 10 };
}

export const buildDependenciesSolvingScenario = (connections: BlockConnection[]): DependencySolvingScenario[] => {
  let dependencySolvingScenarios: DependencySolvingScenario[] = []
  let sequence = 0
  
  buildLists(connections)

  let i = 0
  dependencySolvingScenarios.push({sequence, blockConnections: connections.map(element => {return element})})
  sequence++
  while (connections.length > 0) {

    const connection = connections[i];

    if (connection.from.type === "PROCESS") {
      if (isAvailable(connection.to, connection.from)) {
        connections.splice(i, 1)
        dependencySolvingScenarios.push({sequence, blockConnections: connections.map(element => {return element})})
        sequence++
        i = 0
      } else {
        i++
      }
    }
  }

  console.log("SOLVING SCENARIO 1: ", dependencySolvingScenarios)
  return dependencySolvingScenarios
}

const buildLists = (connections: BlockConnection[]) => {
  connections.forEach(({from, to}) => {
    
    if (from.type === "PROCESS") {
      const processBlock = processNeedLists.find(({block}) => equals(block, from))

      if (processBlock === undefined) {
        processNeedLists.push({block: from, needs: [to]})
      } else {
        processBlock.needs.push(to);
      }
    } else if (from.type === "RESOURCE") {
      const resourceBlock = resourceDispositionLists.find(({block}) => equals(block, from))

      if (resourceBlock === undefined) {
        resourceDispositionLists.push({block: from, isAvailableTo: [to]})
      } else {
        resourceBlock.isAvailableTo.push(to);
      }
    }
  })
}

const isAvailable = (resourceBlockNeeded: Block, processBlock: Block): boolean => {
  const resourceDispositionList: ResourceDispositionList | undefined = resourceDispositionLists.find(({block}) => equals(block, resourceBlockNeeded))

  if (resourceDispositionList === undefined) return true

  if (resourceDispositionList.isAvailableTo.includes(processBlock)) {
    console.log("passei aqui")
    return true
  }

  return false
}