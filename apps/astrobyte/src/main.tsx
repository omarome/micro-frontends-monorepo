// Async import to allow Module Federation to initialize shared modules
import('./bootstrap.js').catch(err => {
  console.error('Failed to load bootstrap:', err);
}); 