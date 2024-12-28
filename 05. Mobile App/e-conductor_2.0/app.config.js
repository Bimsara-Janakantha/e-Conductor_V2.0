import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    backend: process.env.BACKEND_URL,
    googlemap: process.env.GOOGLE_MAPS_API_KEY,
    stripekey: process.env.STRIPE_PUBLIC_KEY,
  },
  scheme: "e-conductor",
});
