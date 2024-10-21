import cluster from 'node:cluster';

if (cluster.isPrimary) {
  import('./multi/primary');
} else {
  import('./multi/worker');
}
