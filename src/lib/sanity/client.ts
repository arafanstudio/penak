import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'zyiqvdmb',
  dataset: 'production',
  useCdn: true, // `false` jika ingin data paling fresh setiap saat
  apiVersion: '2023-05-03', // Gunakan tanggal hari ini atau versi API Sanity yang diinginkan
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
