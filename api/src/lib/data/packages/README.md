# Agency data packages

Each local carrier has one JSON package containing its zones, postal-code
exceptions, pallet types, and rates. General agency metadata such as its name,
type, API configuration, and fuel surcharge remains in `data/agency.js`.

The common package format is:

- `schemaVersion` and `code` identify the package.
- `defaults.zone`, `defaults.rate`, and `defaults.service` define shared values.
- Zone `overrides` and rate `overrides` replace only values that differ from
  those defaults. Nested objects are merged; arrays are replaced.
- `palletTypes` is optional. Rates refer to pallet types by `palletTypeIndex`,
  which also supports agencies with duplicate pallet names.
- `zoneRules.exceptions` contains postcode exceptions.
- `rates` is a list of rate entries, or an object keyed by zone when each zone
  has one service configuration.

The shared initializer resolves defaults and overrides, maps pallet references,
and persists all three data collections. Add a regular static carrier by adding
its JSON package and registering it in
`bootstrap/agencies/init.agencies.data.js`. Use a small JavaScript adapter only
when data must be generated at runtime; Rhenus uses one to derive zones and
postal-code prefixes from the loaded provinces.
