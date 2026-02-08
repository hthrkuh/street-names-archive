import { Client } from '@elastic/elasticsearch';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

interface StreetRecord {
  'שם ראשי': string;
  'תואר': string;
  'שם מישני': string;
  'קבוצה': string;
  'קבוצה נוספת': string;
  'סוג': string;
  'קוד': string;
  'שכונה': string;
  deleted?: boolean;
}

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
const INDEX_NAME = 'street-names';

async function loadCSVToElasticsearch() {
  const client = new Client({ node: ELASTICSEARCH_URL });

  try {
    console.log('Connecting to Elasticsearch...');
    await client.ping();
    console.log('Connected to Elasticsearch successfully!');

    // Read mapping file
    const scriptDir = process.cwd();
    const mappingPath = path.join(scriptDir, 'mappings', 'street-names-mapping.json');
    const mappingContent = fs.readFileSync(mappingPath, 'utf-8');
    const mapping = JSON.parse(mappingContent);

    // Check if index exists, delete if it does
    const indexExists = await client.indices.exists({ index: INDEX_NAME });
    if (indexExists) {
      console.log('Index already exists. Deleting it...');
      await client.indices.delete({ index: INDEX_NAME });
    }

    // Create index with mapping
    console.log('Creating index with mapping...');
    await client.indices.create({
      index: INDEX_NAME,
      body: mapping
    });
    console.log('Index created successfully!');

    // Read and parse CSV file
    const csvPath = path.join(scriptDir, 'מטלת בית ארכיון שמות רחובות (1).csv');
    console.log('Reading CSV file...');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    const records: StreetRecord[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
      encoding: 'utf-8'
    });

    console.log(`Parsed ${records.length} records from CSV`);

    // Prepare bulk operations
    const body: any[] = [];
    for (const record of records) {
      // Add deleted field (default false)
      const doc = {
        ...record,
        deleted: false
      };

      body.push({ index: { _index: INDEX_NAME } });
      body.push(doc);
    }

    // Bulk insert
    console.log('Bulk inserting records...');
    const bulkResponse = await client.bulk({ refresh: true, body });

    if (bulkResponse.errors) {
      const erroredDocuments: any[] = [];
      bulkResponse.items.forEach((action: any, i: number) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            status: action[operation].status,
            error: action[operation].error,
            operation: body[i * 2],
            document: body[i * 2 + 1]
          });
        }
      });
      console.error('Some documents failed to index:', erroredDocuments);
    } else {
      console.log(`Successfully indexed ${records.length} documents!`);
    }

    // Verify the count
    const countResponse = await client.count({ index: INDEX_NAME });
    console.log(`Total documents in index: ${countResponse.count}`);

    console.log('Data loading completed successfully!');
  } catch (error) {
    console.error('Error loading data:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

loadCSVToElasticsearch();

