import { Application, send } from "@oak/oak";

const application = new Application();

application.use(async (context) => {
  await send(
    context,
    context.request.url.pathname,
    {
      root: `${Deno.cwd()}/../client/public`,
    },
  );
});

await application.listen({ port: 8000 });
