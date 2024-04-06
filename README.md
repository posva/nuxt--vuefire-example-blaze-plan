# Nuxt + VueFire Template

[Nuxt](https://nuxtjs.org/) template with [VueFire](https://vuefire.vuejs.org/) to get started with [Firebase](https://firebase.google.com/) using the [**Blaze Plan** (pay as you go)](https://firebase.google.com/pricing). If you are looking for the **Spark Plan** version instead, [check this template instead](https://github.com/posva/nuxt--vuefire-example-spark-plan).

You can check a live demo at [nuxt-vuefire-example-blaze.web.app](https://nuxt-vuefire-example-blaze.web.app).

![Screenshot](./assets/screenshot.png)

In order to test this locally, follow all the steps in [Provisioning Firebase](#provisioning-firebase) and [Development Server](#development-server). Since this example is using most of Firebase features, there are quite a few things to do. In practice, you might only use half of them.

## Trying this out locally

Thanks to [Firebase Emulators](https://firebase.google.com/docs/emulator-suite), you can try this template locally without even creating a Firebase project. You will need to install the [Firebase Tools CLI](https://firebase.google.com/docs/cli) with `npm i -g firebase-tools`, install dependencies with `pnpm i`, and then run in two different processes:

```bash
pnpm run emulators
```

and

```bash
pnpm run dev
```

## Using this template

It's recommended to use git to clone this template and track any changes made by the Firebase Tools CLI to revert them if needed.

You will also need to install the Firebase Tools CLI, either globally or locally. To install globally do:

```bash
npm install -g firebase-tools
```

Then login to your Firebase account with `firebase login`.

Install dependencies with `pnpm install`.

## Provisioning Firebase

Start by creating a Firebase Project [in the console](https://console.firebase.google.com/).

Activate **now** any of the features you want to use (note the starter uses them all):

- Firestore
- Authentication
- Realtime Database
- Storage

Create an Application in the _Project Overview_. This will give you a `firebaseConfig` object, replace the content of `vuefire.config` in `nuxt.config.ts` with it.

Before running `firebase init`, make sure to **delete the `.firebaserc` file** as it's what the Firebase CLI uses to know which project to use. **If you forgot, you will have to set the project with `firebase use <project-id>`**.

Now you have to run `firebase init` at the root of your project. Some notes:

- Select the features you want to use.
- Note the deployed folder of Nuxt is `.output/public`, not `public` as the firebase tools CLI will suggest.
- Selecting GitHub actions will create a service account to allow GitHub to deploy to Firebase. If you don't enable this, you should also remove the `.github/workflows` folder as it will just won't work.

This step should overwrite some files, you can revert most of them if you want to test this template with your own project. The only file that **shouldn't be reverted is** `.firebaserc` as it contains the project ID.

You can also create the `.env` from the example:

```bash
mv .env.example .env
```

You can now clean up any files you don't need, for example, if you are not using the Realtime Database, you can delete `database.rules.json`.

You can also remove the `./functions` folder as the Nuxt project builds that for you.
Replace the `"function"` config in `firebase.json` with:

```json
{
  "functions": [
    {
      "source": ".output/server",
      "codebase": "default",
      "ignore": [".git", "firebase-debug.log", "firebase-debug.*.log"]
    }
  ]
}
```

Nuxt will generate the `.output/server` folder when running `nuxt build`.

### Service Account

For server side rendering to work, you will need to create a service account. You can do this from the _Project Settings_, _Service Accounts_ tab. Then, download the JSON file and save it as `service-account.json` at the root of your project. The `.env` file should already have a variable pointing to it.

### Authentication

To enable authentication during SSR, you will need to enable the IAM Service Account Credentials API on the [Google Cloud console](https://console.cloud.google.com/apis/api/iamcredentials.googleapis.com/overview).

Once this API is activated, you will need to add a role to your service account. This is explained in [the Firebase documentation](https://firebase.google.com/docs/auth/admin/create-custom-tokens#iam_api_not_enabled). This project, because it is running in a 2nd generation cloud function, needs to have the `Service Account Token Creator` role added to the `{RANDOM_NUMBER}-compute@developer.gserviceaccount.com` service account.

### App Check

> If you don't want to use App Check, delete the `vuefire.appCheck` object from `nuxt.config.ts` and remove the line `FIREBASE_APPCHECK_DEBUG_TOKEN=...` from `.env`.

Once you have completed the deployment as explained above, you can optionally register App Check. You will then need to register a _reCAPTCHA v3_ provider. You can find the instructions for this in [Firebase Documentation](https://firebase.google.com/docs/app-check#web), they will tell you [to register your site for reCAPTCHA v3](https://www.google.com/recaptcha/admin/create) and to copy your _secret key_ in the firebase console. Then, you will need to copy the _site key_ in your `nuxt.config.ts` file:

```ts{8} [nuxt.config.ts]
export default defineNuxtConfig({
  // ...
  vuefire: {
    // ...
    appCheck: {
      provider: 'ReCaptchaV3',
      // site key, NOT secret key
      key: '...',
      isTokenAutoRefreshEnabled: true,
    },
  },
})
```

It's also recommended to generate a debug token now from the Firebase Console, on the Apps tab, and add it to your `.env` file:

```txt
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
FIREBASE_APPCHECK_DEBUG_TOKEN=...
```

Note you will need to enforce App Check on the _APIs_ tab of the Firebase Console for each service you want to protect.

## Development Server

If you added support for emulators, you will need to start them before starting the Nuxt development server.

You can start the emulators with `npm run emulators` or `firebase emulators:start`. Then start the server with `npm run dev`.

### Debugging

You can activate VueFire logs with:

```bash
CONSOLA_LEVEL=5 npm run dev
```

## Building for Production

Since this is an SSR app, building for production is usually done with `pnpm run build`.

### Previewing Locally

In order to preview a production build locally, you will need to enable debug mode for App Check and also emulators:

```bash
VUEFIRE_APPCHECK_DEBUG=true VUEFIRE_EMULATORS=true pnpm run build
```

Then you can run the emulators to preview your app:

```bash
pnpm run emulators
```

Your app will then be accessible on `http://localhost:5050`.

You can also not use emulators but some features like auth might not work since we are on localhost.

### Deploying to Firebase

Always deploy once from the CLI as it might prompt you to create some roles. Once this is done, _link the hosting site_ with the app from the _Project Settings_, _Your apps_ section.

You can deploy manually with `pnpm run build && firebase deploy`.

### Troubleshooting

## Failed deployments

In some rare occasions, an initial deployment might fail with different errors, given the complexity of some deployments, I recommend you to google the error message. Very often, [deleting the function and redeploying fixes the issue](https://github.com/firebase/firebase-tools/issues/5244).

## Logs

You will find more information in the logs of the functions, accessible from the Firebase Console. Note you might want to set the `CONSOLA_LEVEL` _environment variable_ to 5 in your deployment to enable debug logs.

### Automatic Deployments on GitHub

If you enabled GitHub Actions, you can now push to GitHub and it will automatically deploy to Firebase Hosting. **You still need to manually deploy Firestore, Realtime Database, and Storage** with `firebase deploy` or selectively with `--only`, e.g. `firebase deploy --only storage`.
