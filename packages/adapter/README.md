# NuSnap adapter

NuSnap adapter is used to install NuCypher snap and expose API toward snap.

## Usage

Adapter has only exposed function for installing NuCypher snap.

```typescript
async function enableNucypherSnap(
  config: Partial<SnapConfig>,
  pluginOrigin?: string
): Promise<MetamaskNucypherSnap>;
```

On snap installation, it is possible to send full or partial configuration.
If you only provide `network` property a predefined configuration for the specified network will be used.
Other properties are optional but will override default values if provided.

Below you can see structure of config object:

```typescript
export interface SnapConfig {
  derivationPath: string;
  network: NucypherNetwork; // "mainnet" | "rinkeby" | ...
}
```

After snap installation, this function returns `MetamaskNucypherSnap` object that can be used to retrieve snap API.
An example of initializing NuCypher snap and invoking snap API is shown below.

```typescript
// install snap and fetch API
const snap = await enableNucypherSnap({ network: "mainnet" });
const api = await MetamaskNucypherSnap.getNucypherSnapApi();

// invoke API
const address = await api.getAddress();

console.log(`Snap installed, account generated with address: ${address}`);
```
