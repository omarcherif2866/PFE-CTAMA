function generateUniqueReference() {
    return 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  
  export { generateUniqueReference };
