// studio/schemas/book.js

// Import the custom input component from the components folder.
import GoogleBookFetcher from '../components/GoogleBookFetcher'

/**
 * This schema defines a "book" document in Sanity.
 * It stores basic book data (title, authors, cover image) along with custom fields
 * to track your personal reading/listening status and the formats you own.
 */
export default {
  // Unique identifier for this document type.
  name: 'book',

  // Human-readable title that appears in the Sanity Studio.
  title: 'Book',

  // Declare that this is a document type.
  type: 'document',

  // Define all the fields for this document.
  fields: [
    {
      // Field to store the Google Books ID or full URL.
      // The custom input component (GoogleBookFetcher) handles fetching data
      // from the Google Books API and patching the document.
      name: 'googleBookId',
      title: 'Google Book ID or URL',
      type: 'string',
      description:
        'Enter the Google Book ID or the full URL from Google Books to auto-fetch additional book details.',
      // IMPORTANT: Use the custom component
      inputComponent: GoogleBookFetcher,
    },
    {
      // Field for the book title.
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The title of the book.',
    },
    {
      // Field to store one or more author names.
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of authors.',
    },
    {
      // Field to store the URL of the book cover image.
      name: 'coverImage',
      title: 'Cover Image URL',
      type: 'url',
      description: 'The URL of the book cover, usually pulled from an external API.',
    },
    {
      // Object field to group reading/listening status properties.
      name: 'status',
      title: 'Status',
      type: 'object',
      fields: [
        { name: 'read', title: 'Read', type: 'boolean' },
        { name: 'listened', title: 'Listened', type: 'boolean' },
        { name: 'currentlyReading', title: 'Currently Reading', type: 'boolean' },
        { name: 'currentlyListening', title: 'Currently Listening To', type: 'boolean' },
        { name: 'wantToRead', title: 'Want to Read', type: 'boolean' },
        {
          name: 'times',
          title: 'Times Read/ Listened',
          type: 'number',
          description: 'Number of times you have read or listened to the book.',
        },
      ],
      options: {
        // Collapsible object for cleaner UI.
        collapsible: true,
        collapsed: true,
      },
      description: 'Your personal reading/listening status for this book.',
    },
    {
      // Object field to track which formats of the book you own.
      name: 'formatsOwned',
      title: 'Formats Owned',
      type: 'object',
      fields: [
        { name: 'ebook', title: 'Ebook', type: 'boolean' },
        { name: 'audiobook', title: 'Audiobook', type: 'boolean' },
        {
          name: 'physicalCopy',
          title: 'Physical Copy',
          type: 'boolean',
          description: 'Check if you own a physical copy of the book.',
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
      description: 'Check the formats you own for this book.',
    },
  ],
}
