import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../shared/proto/hasher.proto');


const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const grpcObject = loadPackageDefinition(packageDefinition) as any;

const hasherProto = grpcObject.hasher;

const target = process.env.HASHER_HOST
    ? process.env.HASHER_HOST
    : 'localhost:50051';


const client = new hasherProto.HasherService(
    target,
    credentials.createInsecure()
);

export function compareHash(plain: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        client.compare({ plain, hash }, (err: any, response: any) => {
            if (err) return reject(err);
            resolve(response.match);
        });
    });
}
