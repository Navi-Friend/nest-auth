"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = __importStar(require("@prisma/client/runtime/client"));
const config = {
    "previewFeatures": [],
    "clientVersion": "7.8.0",
    "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
    "activeProvider": "postgresql",
    "inlineSchema": "// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider               = \"prisma-client\"\n  output                 = \"../src/generated/prisma\"\n  generatedFileExtension = \"ts\"\n  moduleFormat           = \"cjs\"\n  importFileExtension    = \"\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel User {\n  id Int @id @default(autoincrement())\n\n  name     String\n  email    String  @unique()\n  password String?\n\n  isVerified                 Boolean   @default(false)\n  verificationToken          String?   @unique()\n  verificationTokenExpiresAt DateTime?\n  sendEmailAttempts          Int       @default(0)\n  lastEmailSentAt            DateTime?\n\n  twoFactorSecret    String?\n  isTwoFactorEnabled Boolean @default(false)\n\n  googleId String? @unique() @map(\"google_id\")\n\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n  @@map(\"users\")\n}\n\n// model Movie {\n//   id          String  @id @default(uuid())\n//   title       String\n//   description String?\n//   releaseYear Int     @map(\"release_year\")\n//   rating      Float   @default(0.0)\n//   isAvailable Boolean @default(true) @map(\"is_available\")\n//   genre       Genre   @default(DRAMA)\n\n//   posterId String?      @unique @map(\"poster_id\")\n//   poster   MoviePoster? @relation(\"movie_posters\", fields: [posterId], references: [id])\n\n//   reviews Review[] @relation(\"movie_reviews\")\n//   actors  Actor[]  @relation(\"movie_actors\")\n\n//   createdAt DateTime @default(now()) @map(\"created_at\")\n//   updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n//   @@map(\"movies\")\n// }\n\n// model MoviePoster {\n//   id String @id @default(uuid())\n\n//   imageUrl String @map(\"image_url\")\n\n//   movie Movie? @relation(\"movie_posters\")\n\n//   createdAt DateTime @default(now()) @map(\"created_at\")\n//   updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n//   @@map(\"movie_posters\")\n// }\n\n// model Review {\n//   id          String  @id @default(uuid())\n//   description String\n//   rating      Decimal @default(0.0)\n\n//   movieId String @map(\"movie_id\")\n//   movie   Movie  @relation(\"movie_reviews\", fields: [movieId], references: [id], onDelete: Cascade)\n\n//   createdAt DateTime @default(now()) @map(\"created_at\")\n//   updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n//   @@map(\"reviews\")\n// }\n\n// model Actor {\n//   id String @id @default(uuid())\n\n//   name String\n\n//   movies Movie[] @relation(\"movie_actors\")\n\n//   createdAt DateTime @default(now()) @map(\"created_at\")\n//   updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n//   @@map(\"actors\")\n// }\n\n// enum Genre {\n//   ACTION\n//   COMEDY\n//   DRAMA\n//   HORROR\n\n//   @@map(\"genres_enum\")\n// }\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    },
    "parameterizationSchema": {
        "strings": [],
        "graph": ""
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isVerified\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"verificationToken\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"verificationTokenExpiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"sendEmailAttempts\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"lastEmailSentAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"twoFactorSecret\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isTwoFactorEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"googleId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"google_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"}],\"dbName\":\"users\"}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"User.findUnique\",\"User.findUniqueOrThrow\",\"orderBy\",\"cursor\",\"User.findFirst\",\"User.findFirstOrThrow\",\"User.findMany\",\"data\",\"User.createOne\",\"User.createMany\",\"User.createManyAndReturn\",\"User.updateOne\",\"User.updateMany\",\"User.updateManyAndReturn\",\"create\",\"update\",\"User.upsertOne\",\"User.deleteOne\",\"User.deleteMany\",\"having\",\"_count\",\"_avg\",\"_sum\",\"_min\",\"_max\",\"User.groupBy\",\"User.aggregate\",\"AND\",\"OR\",\"NOT\",\"id\",\"name\",\"email\",\"password\",\"isVerified\",\"verificationToken\",\"verificationTokenExpiresAt\",\"sendEmailAttempts\",\"lastEmailSentAt\",\"twoFactorSecret\",\"isTwoFactorEnabled\",\"googleId\",\"createdAt\",\"updatedAt\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"contains\",\"startsWith\",\"endsWith\",\"set\",\"increment\",\"decrement\",\"multiply\",\"divide\"]"),
    graph: "QQsQERwAAC8AMB0AAAQAEB4AAC8AMB8CAAAAASABADEAISEBAAAAASIBADIAISMgADMAISQBAAAAASVAADQAISYCADAAISdAADQAISgBADIAISkgADMAISoBAAAAAStAADUAISxAADUAIQEAAAABACABAAAAAQAgERwAAC8AMB0AAAQAEB4AAC8AMB8CADAAISABADEAISEBADEAISIBADIAISMgADMAISQBADIAISVAADQAISYCADAAISdAADQAISgBADIAISkgADMAISoBADIAIStAADUAISxAADUAIQYiAAA2ACAkAAA2ACAlAAA2ACAnAAA2ACAoAAA2ACAqAAA2ACADAAAABAAgAwAABQAwBAAAAQAgAwAAAAQAIAMAAAUAMAQAAAEAIAMAAAAEACADAAAFADAEAAABACAOHwIAAAABIAEAAAABIQEAAAABIgEAAAABIyAAAAABJAEAAAABJUAAAAABJgIAAAABJ0AAAAABKAEAAAABKSAAAAABKgEAAAABK0AAAAABLEAAAAABAQgAAAkAIA4fAgAAAAEgAQAAAAEhAQAAAAEiAQAAAAEjIAAAAAEkAQAAAAElQAAAAAEmAgAAAAEnQAAAAAEoAQAAAAEpIAAAAAEqAQAAAAErQAAAAAEsQAAAAAEBCAAACwAwAQgAAAsAMA4fAgBAACEgAQA8ACEhAQA8ACEiAQA9ACEjIAA-ACEkAQA9ACElQAA_ACEmAgBAACEnQAA_ACEoAQA9ACEpIAA-ACEqAQA9ACErQABBACEsQABBACECAAAAAQAgCAAADgAgDh8CAEAAISABADwAISEBADwAISIBAD0AISMgAD4AISQBAD0AISVAAD8AISYCAEAAISdAAD8AISgBAD0AISkgAD4AISoBAD0AIStAAEEAISxAAEEAIQIAAAAEACAIAAAQACACAAAABAAgCAAAEAAgAwAAAAEAIA8AAAkAIBAAAA4AIAEAAAABACABAAAABAAgCxUAADcAIBYAADgAIBcAADsAIBgAADoAIBkAADkAICIAADYAICQAADYAICUAADYAICcAADYAICgAADYAICoAADYAIBEcAAAaADAdAAAXABAeAAAaADAfAgAbACEgAQAcACEhAQAcACEiAQAdACEjIAAeACEkAQAdACElQAAfACEmAgAbACEnQAAfACEoAQAdACEpIAAeACEqAQAdACErQAAgACEsQAAgACEDAAAABAAgAwAAFgAwFAAAFwAgAwAAAAQAIAMAAAUAMAQAAAEAIBEcAAAaADAdAAAXABAeAAAaADAfAgAbACEgAQAcACEhAQAcACEiAQAdACEjIAAeACEkAQAdACElQAAfACEmAgAbACEnQAAfACEoAQAdACEpIAAeACEqAQAdACErQAAgACEsQAAgACENFQAAIgAgFgAALgAgFwAAIgAgGAAAIgAgGQAAIgAgLQIAAAABLgIAAAAELwIAAAAEMAIAAAABMQIAAAABMgIAAAABMwIAAAABNAIALQAhDhUAACIAIBgAACwAIBkAACwAIC0BAAAAAS4BAAAABC8BAAAABDABAAAAATEBAAAAATIBAAAAATMBAAAAATQBACsAITUBAAAAATYBAAAAATcBAAAAAQ4VAAAlACAYAAAqACAZAAAqACAtAQAAAAEuAQAAAAUvAQAAAAUwAQAAAAExAQAAAAEyAQAAAAEzAQAAAAE0AQApACE1AQAAAAE2AQAAAAE3AQAAAAEFFQAAIgAgGAAAKAAgGQAAKAAgLSAAAAABNCAAJwAhCxUAACUAIBgAACYAIBkAACYAIC1AAAAAAS5AAAAABS9AAAAABTBAAAAAATFAAAAAATJAAAAAATNAAAAAATRAACQAIQsVAAAiACAYAAAjACAZAAAjACAtQAAAAAEuQAAAAAQvQAAAAAQwQAAAAAExQAAAAAEyQAAAAAEzQAAAAAE0QAAhACELFQAAIgAgGAAAIwAgGQAAIwAgLUAAAAABLkAAAAAEL0AAAAAEMEAAAAABMUAAAAABMkAAAAABM0AAAAABNEAAIQAhCC0CAAAAAS4CAAAABC8CAAAABDACAAAAATECAAAAATICAAAAATMCAAAAATQCACIAIQgtQAAAAAEuQAAAAAQvQAAAAAQwQAAAAAExQAAAAAEyQAAAAAEzQAAAAAE0QAAjACELFQAAJQAgGAAAJgAgGQAAJgAgLUAAAAABLkAAAAAFL0AAAAAFMEAAAAABMUAAAAABMkAAAAABM0AAAAABNEAAJAAhCC0CAAAAAS4CAAAABS8CAAAABTACAAAAATECAAAAATICAAAAATMCAAAAATQCACUAIQgtQAAAAAEuQAAAAAUvQAAAAAUwQAAAAAExQAAAAAEyQAAAAAEzQAAAAAE0QAAmACEFFQAAIgAgGAAAKAAgGQAAKAAgLSAAAAABNCAAJwAhAi0gAAAAATQgACgAIQ4VAAAlACAYAAAqACAZAAAqACAtAQAAAAEuAQAAAAUvAQAAAAUwAQAAAAExAQAAAAEyAQAAAAEzAQAAAAE0AQApACE1AQAAAAE2AQAAAAE3AQAAAAELLQEAAAABLgEAAAAFLwEAAAAFMAEAAAABMQEAAAABMgEAAAABMwEAAAABNAEAKgAhNQEAAAABNgEAAAABNwEAAAABDhUAACIAIBgAACwAIBkAACwAIC0BAAAAAS4BAAAABC8BAAAABDABAAAAATEBAAAAATIBAAAAATMBAAAAATQBACsAITUBAAAAATYBAAAAATcBAAAAAQstAQAAAAEuAQAAAAQvAQAAAAQwAQAAAAExAQAAAAEyAQAAAAEzAQAAAAE0AQAsACE1AQAAAAE2AQAAAAE3AQAAAAENFQAAIgAgFgAALgAgFwAAIgAgGAAAIgAgGQAAIgAgLQIAAAABLgIAAAAELwIAAAAEMAIAAAABMQIAAAABMgIAAAABMwIAAAABNAIALQAhCC0IAAAAAS4IAAAABC8IAAAABDAIAAAAATEIAAAAATIIAAAAATMIAAAAATQIAC4AIREcAAAvADAdAAAEABAeAAAvADAfAgAwACEgAQAxACEhAQAxACEiAQAyACEjIAAzACEkAQAyACElQAA0ACEmAgAwACEnQAA0ACEoAQAyACEpIAAzACEqAQAyACErQAA1ACEsQAA1ACEILQIAAAABLgIAAAAELwIAAAAEMAIAAAABMQIAAAABMgIAAAABMwIAAAABNAIAIgAhCy0BAAAAAS4BAAAABC8BAAAABDABAAAAATEBAAAAATIBAAAAATMBAAAAATQBACwAITUBAAAAATYBAAAAATcBAAAAAQstAQAAAAEuAQAAAAUvAQAAAAUwAQAAAAExAQAAAAEyAQAAAAEzAQAAAAE0AQAqACE1AQAAAAE2AQAAAAE3AQAAAAECLSAAAAABNCAAKAAhCC1AAAAAAS5AAAAABS9AAAAABTBAAAAAATFAAAAAATJAAAAAATNAAAAAATRAACYAIQgtQAAAAAEuQAAAAAQvQAAAAAQwQAAAAAExQAAAAAEyQAAAAAEzQAAAAAE0QAAjACEAAAAAAAABOAEAAAABATgBAAAAAQE4IAAAAAEBOEAAAAABBTgCAAAAATkCAAAAAToCAAAAATsCAAAAATwCAAAAAQE4QAAAAAEAAAAABRUABhYABxcACBgACRkACgAAAAAABRUABhYABxcACBgACRkACgECAQIDAQUGAQYHAQcIAQkKAQoMAgsNAwwPAQ0RAg4SBBETARIUARMVAhoYBRsZCw"
};
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await import('node:buffer');
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js"),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js");
        return await decodeBase64AsWasm(wasm);
    },
    importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map