import { client } from '$lib/sanity/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const services = await client.fetch(`*[_type == "service"] | order(order asc) {
    "id": id.current,
    title,
    image,
    order,
    url
  }`);

  return {
    services
  };
};
