# NX Serverless

A simple plugin for running sls commands in nx monorepo.
It executes serverless commands in specific app directory.
It is configured to support nx cache out of the box for build and deploy commands.

## Install

```
npm i -D @ns3/nx-serverless
```

## Generate

```
nx generate @ns3/nx-serverless:app my-app-name
```

## Custom commands

Should you need a more specific command that is not included you can add it to your `workspace.json` like that:

```json
        "logs": {
          "executor": "@nrwl/workspace:run-commands",
          "options": {
            "cwd": "<location of your application>",
            "color": true,
            "command": "sls logs"
          }
        },
```
