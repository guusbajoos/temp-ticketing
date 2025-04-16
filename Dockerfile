FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@9.9.0 --activate
WORKDIR /app
COPY . .


FROM base AS build
RUN pnpm install --frozen-lockfile
RUN pnpm build


FROM base
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build

EXPOSE 3000
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "3000"]
