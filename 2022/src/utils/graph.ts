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
