import { Server, ServerCredentials, loadPackageDefinition } from '@grpc/grpc-js';
import bcrypt from 'bcrypt';
import path from 'path';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = path.join(__dirname, 'shared/proto/hasher.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = loadPackageDefinition(packageDefinition) as any;

const hasherProto = grpcObject.hasher;

function compare(call: any, callback: any) {
  const { plain, hash } = call.request;
  console.log("Handling request from:", call.getPeer());
  bcrypt.compare(plain, hash, (err, result) => {
    if (err) return callback(err);
    callback(null, { match: result });
  });
}

function main() {
  const server = new Server();
  server.addService(hasherProto.HasherService.service, { compare });
  server.bindAsync('0.0.0.0:50051', ServerCredentials.createInsecure(), () => {
    console.log('Hasher gRPC server running on port 50051');
    server.start();
  });
}

main();
