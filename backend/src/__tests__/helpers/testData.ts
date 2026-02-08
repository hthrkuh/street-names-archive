/**
 * Test data helpers for integration tests
 */
import { Client } from '@elastic/elasticsearch';

const TEST_INDEX = 'street-names-test';
const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

/**
 * Create test index with sample data
 */
export async function setupTestIndex(): Promise<void> {
  const client = new Client({ node: ELASTICSEARCH_URL });

  try {
    // Delete test index if it exists
    const exists = await client.indices.exists({ index: TEST_INDEX });
    if (exists) {
      await client.indices.delete({ index: TEST_INDEX });
    }

    // Create test index with mapping
    await client.indices.create({
      index: TEST_INDEX,
      body: {
        mappings: {
          properties: {
            'שם ראשי': { type: 'text', fields: { keyword: { type: 'keyword' } } },
            'תואר': { type: 'text', fields: { keyword: { type: 'keyword' } } },
            'שם מישני': { type: 'text', fields: { keyword: { type: 'keyword' } } },
            'קבוצה': { type: 'text', fields: { keyword: { type: 'keyword' } } },
            'קבוצה נוספת': { type: 'text', fields: { keyword: { type: 'keyword' } } },
            'סוג': { type: 'text', fields: { keyword: { type: 'keyword' } } },
            'קוד': { type: 'keyword' },
            'שכונה': { type: 'text', fields: { keyword: { type: 'keyword' } } },
            deleted: { type: 'boolean', index: true }
          }
        }
      }
    });

    // Insert test documents
    const testDocuments = [
      {
        'שם ראשי': 'אוסישקין',
        'תואר': '',
        'שם מישני': 'מנחם (מנדל)',
        'קבוצה': 'ד. הסטוריה יהודית',
        'קבוצה נוספת': '',
        'סוג': 'רחוב',
        'קוד': '801',
        'שכונה': 'א',
        deleted: false
      },
      {
        'שם ראשי': 'בלפור',
        'תואר': 'לורד',
        'שם מישני': 'ג\'ימס',
        'קבוצה': 'ג. אישים בינלאומיים',
        'קבוצה נוספת': '',
        'סוג': 'רחוב',
        'קוד': '805',
        'שכונה': 'א',
        deleted: false
      },
      {
        'שם ראשי': 'ויצמן',
        'תואר': 'פרופ\'',
        'שם מישני': 'חיים',
        'קבוצה': 'ד. הסטוריה יהודית',
        'קבוצה נוספת': '',
        'סוג': 'רחוב',
        'קוד': '814',
        'שכונה': 'א',
        deleted: false
      },
      {
        'שם ראשי': 'תל חי',
        'תואר': '',
        'שם מישני': '',
        'קבוצה': 'ז. מקומות של עם ישראל',
        'קבוצה נוספת': '',
        'סוג': 'רחוב',
        'קוד': '825',
        'שכונה': 'א',
        deleted: true // This one is deleted
      }
    ];

    // Bulk insert
    const body: any[] = [];
    for (const doc of testDocuments) {
      body.push({ index: { _index: TEST_INDEX } });
      body.push(doc);
    }

    await client.bulk({ refresh: true, body });

    // Wait a bit for index to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    await client.close();
  } catch (error) {
    await client.close();
    throw error;
  }
}

/**
 * Clean up test index
 */
export async function cleanupTestIndex(): Promise<void> {
  const client = new Client({ node: ELASTICSEARCH_URL });

  try {
    const exists = await client.indices.exists({ index: TEST_INDEX });
    if (exists) {
      await client.indices.delete({ index: TEST_INDEX });
    }
    await client.close();
  } catch (error) {
    await client.close();
    // Ignore cleanup errors
  }
}

