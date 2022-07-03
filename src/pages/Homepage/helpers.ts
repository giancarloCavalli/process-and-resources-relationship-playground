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
  console.log("ProcessNeedLists", processNeedLists)
  console.log("ResourceDispositionLists", resourceDispositionLists)

  return []

  // let i = 0
  // dependencySolvingScenarios.push({sequence, blockConnections: connections.map(element => {return element})})
  // sequence++
  // while (connections.length > 0) {

  //   const connection = connections[i];

  //   if (connection.from.type === "PROCESS") {
  //     if (isAvailable(connection.to, connection.from)) {
  //       connections.splice(i, 1)
  //       dependencySolvingScenarios.push({sequence, blockConnections: connections.map(element => {return element})})
  //       sequence++
  //       i = 0
  //     } else {
  //       i++
  //     }
  //   }
  // }

  // console.log("SOLVING SCENARIO 1: ", dependencySolvingScenarios)
  // return dependencySolvingScenarios
}

const buildLists = (blockConnections: BlockConnection[]) => {
  processNeedLists.splice(0, processNeedLists.length);
  resourceDispositionLists.splice(0, resourceDispositionLists.length);

  blockConnections.forEach(({from, to}) => {
    
    if (from.type === "PROCESS") {
      addProcessToList(processNeedLists, from, to)
    } else if (from.type === "RESOURCE") {
      addResourceToList(resourceDispositionLists, from, to)
      addProcessToList(processNeedLists, to, from)
    }
  })
}

const addProcessToList = (processNeedLists: ProcessNeedList[], processBlock: Block, resourceBlock: Block) => {
  const processNeedList = processNeedLists.find(({block}) => equals(block, processBlock))

  if (processNeedList === undefined) {
    processNeedLists.push({block: processBlock, needs: [resourceBlock]})
  } else {
    processNeedList.needs.push(resourceBlock);
  }
}

const addResourceToList = (resourceDispositionLists: ResourceDispositionList[], resourceBlock: Block, processBlock: Block) => {
  const resourceDispositionList = resourceDispositionLists.find(({block}) => equals(block, resourceBlock))

  if (resourceDispositionList === undefined) {
    resourceDispositionLists.push({block: resourceBlock, isAvailableTo: [processBlock]})
  } else {
    resourceDispositionList.isAvailableTo.push(processBlock);
  }
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