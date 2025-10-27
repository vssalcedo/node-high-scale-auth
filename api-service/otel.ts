
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { AlwaysOnSampler } from '@opentelemetry/sdk-trace-base';
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';

// Instrumentations
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';

const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: 'concurrent-login',
    }),
    contextManager: new AsyncLocalStorageContextManager(),
    sampler: new AlwaysOnSampler(),
    traceExporter: new OTLPTraceExporter(),
    instrumentations: [
        new HttpInstrumentation(),
        new PgInstrumentation()
    ]
});

sdk.start();

process.on("SIGTERM", () => {
    sdk.shutdown()
        .then(() => console.log("Tracing terminated"))
        .catch((err) => console.error("Error shutting down tracing", err))
        .finally(() => process.exit(0));
});
