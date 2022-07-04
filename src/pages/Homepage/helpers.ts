import { equal } from "assert";
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
  let notInDeadLock = true
  dependencySolvingScenarios.push({sequence, blockConnections: connections.map(element => {return element})})
  sequence++
  let copyConnections = connections.map((connection) => {return connection})
  
  while (notInDeadLock && copyConnections.length > 0) {
    const {from, to} = copyConnections[i];

    if (from.type === "PROCESS") {
      
      const process = from
      const resource = to
      
      if (areAllResourcesAvailable(process)) {
        copyConnections = removeConnectionsBetweenAndReturnUpdatedList(process, resource, copyConnections)
        dependencySolvingScenarios.push({sequence, blockConnections: copyConnections.map(element => {return element})})
        sequence++
        i = 0
      } else {
        if (i === copyConnections.length - 1) {
          dependencySolvingScenarios = []
          notInDeadLock = false
        } else {
          i++
        }
      }
    } else if (from.type === "RESOURCE") {

      const process = to
      const resource = from

      if (areAllResourcesAvailable(process)) {
        copyConnections = removeConnectionsBetweenAndReturnUpdatedList(process, resource, copyConnections)
        dependencySolvingScenarios.push({sequence, blockConnections: copyConnections.map(element => {return element})})
        sequence++
        i = 0
      } else {
        if (i === copyConnections.length - 1) {
          dependencySolvingScenarios = []
          notInDeadLock = false
        } else {
          i++
        }
      }
    }
  }

  return dependencySolvingScenarios
}

const getQtResourceNeededForProcessBlock = (resourceBlock: Block, processNeedList: ProcessNeedList): number => {
  let counter = 0

  processNeedList.needs.forEach((resourceBlockFE) => {
    if (equals(resourceBlockFE, resourceBlock)) {
      counter++
    }
  })

  return counter
}

const removeConnectionsBetweenAndReturnUpdatedList = (process: Block, resource: Block, connections: BlockConnection[]): BlockConnection[] => {
  for (let i = 0; i < connections.length; i++) {
    const { from, to } = connections[i]

    if ((equals(from, process) && equals(to, resource)) || (equals(to, process) && equals(from, resource))) {
      connections.splice(i, 1)
      i--
    }
  }

  buildLists(connections)

  return connections
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

const isResourceAvailable = (resource: Block, process: Block, qtResourceNeeded: number): boolean => {
  const availableQuantity = resource.resourceQuantity - getQtAllocatedToOtherProcesses(resource, process)
  
  if (availableQuantity >= qtResourceNeeded) return true

  return false
}

const areAllResourcesAvailable = (process: Block): boolean => {
  const processNeed = processNeedLists.find(({block}) => equals(block, process))

  if (processNeed === undefined) return true

  const processNeedList = processNeedLists.find(({block}) => equals(block, process)) as ProcessNeedList
  let allResourcesAvailable = true

  processNeed.needs.forEach(resource => {
    if (false === isResourceAvailable(resource, process, getQtResourceNeededForProcessBlock(resource, processNeedList))) {
      allResourcesAvailable = false
    }
  })
  
  return allResourcesAvailable
}

const getQtAllocatedToOtherProcesses = (resource: Block, process: Block) => {
  const disposition = resourceDispositionLists.find(({block}) => equals(block, resource))

  if (disposition === undefined) return 0

  const qtAllocatedToOtherProcesses = disposition.isAvailableTo.filter((block) => !equals(block, process)).length

  return qtAllocatedToOtherProcesses
}