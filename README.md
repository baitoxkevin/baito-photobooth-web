# BAITO Photobooth Collection Viewer

A simple web app for viewing and downloading photo collections shared via QR codes from the BAITO Photobooth mobile app.

## Features

- View shared photo collections in any web browser
- Responsive design that works on mobile and desktop
- Download individual photos
- View photos in full-screen mode
- Dark mode support (follows system preferences)
- Automatic image lazy loading for better performance

## Deployment

This web app is designed to be deployed on Netlify with minimal configuration:

1. Push this folder to a GitHub repository
2. Connect the repository to Netlify
3. Use the following build settings:
   - Build command: (none - leave blank)
   - Publish directory: `.` (the root directory)

The `netlify.toml` file will take care of configuration.

## How it Works

The web app loads a list of photo URLs from query parameters in the format:

```
https://baito-photobooth.netlify.app/?title=My%20Collection&photos=["url1","url2","url3"]
```

The URLs can be provided in two formats:
- JSON array in the `photos` parameter
- Comma-separated list in the `photos` parameter

## Local Development

To test locally, simply open `index.html` in a browser. You can simulate a shared collection by adding query parameters to the URL.

## License

This web app is designed specifically for BAITO Photobooth and is not licensed for other uses without permission.