export class Graph {
  nodes: Set<string>;
  adjList: { [key: string]: { [key: string]: number } };
  constructor() {
    this.nodes = new Set<string>();
    this.adjList = {};
  }

  private ensureNode(node: string) {
    if (!this.nodes.has(node)) {
      this.nodes.add(node);
      this.adjList[node] = {};
    }
  }

  addEdge(node1: string, node2: string, weight: number = 1) {
    this.ensureNode(node1);
    this.ensureNode(node2);
    this.adjList[node1][node2] = weight;
  }

  dijkstra(start: string) {
    const distances: { [key: string]: number } = {},
      parents: { [key: string]: string | null } = {},
      visited = new Set<string>();
    this.nodes.forEach(n => {
      if (n === start) {
        distances[start] = 0;
      } else {
        distances[n] = Infinity;
      }
      parents[n] = null;
    });

    let cNode = this.getClosestNode(distances, visited);

    while (cNode !== null) {
      const distance = distances[cNode];
      const neighbors = this.adjList[cNode];
      Object.keys(neighbors).forEach(neighbor => {
        const newDistance = distance + neighbors[neighbor];
        if (distances[neighbor] > newDistance) {
          distances[neighbor] = newDistance;
          parents[neighbor] = cNode;
        }
      });
      visited.add(cNode);
      cNode = this.getClosestNode(distances, visited);
    }
    return { distances, parents };
  }

  private getClosestNode(distances: { [key: string]: number }, visited: Set<string>): string | null {
    let minDistance = Infinity,
      closestNode: string | null = null;
    Object.keys(distances).forEach(node => {
      let distance = distances[node];
      if (distance < minDistance && !visited.has(node)) {
        minDistance = distance;
        closestNode = node;
      }
    });
    return closestNode;
  }
}

function search(
  startNode: any,
  getNeighbours: (node: any, depth: number) => any[],
  visitNode: (node: any, depth: number) => void,
  getNextNode: (items: any[]) => any,
  maxDepth: number,
) {
  const visited: { [key: string]: boolean } = {};
  let items: [any, number][] = [[startNode, 0]];
  while (items.length && items[0][1] <= maxDepth) {
    const [node, depth] = getNextNode(items)!;
    const key = node.toString();
    if (visited[key]) continue;

    visited[key] = true;
    visitNode(node, depth);
    if (depth < maxDepth) {
      const neighbours = getNeighbours(node, depth + 1) || [];
      items.push(...neighbours.map(n => [n, depth + 1] as [any, number]));
    }
  }
}

export function dfs(
  startNode: any,
  getNeighbours: (node: any, depth: number) => any[],
  visitNode: (node: any, depth: number) => void,
  maxDepth: number = Infinity,
) {
  search(startNode, getNeighbours, visitNode, items => items.pop(), maxDepth);
}

export function bfs(
  startNode: any,
  getNeighbours: (node: any, depth: number) => any[],
  visitNode: (node: any, depth: number) => void,
  maxDepth: number = Infinity,
) {
  search(startNode, getNeighbours, visitNode, items => items.shift(), maxDepth);
}
