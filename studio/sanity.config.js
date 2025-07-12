import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import schemas from './schemas' // This is the default export from index.js

export default defineConfig({
  name: 'default',
  title: 'Beavertr.app Studio',
  projectId: 'o2qco9k1',
  dataset: 'production',
  plugins: [deskTool()],
  schema: {
    // "types" must be an array of your schema documents
    types: schemas,
  },
})
