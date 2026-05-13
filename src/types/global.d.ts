declare const process: {
  env: Record<string, string | undefined>;
};

declare module 'core/CoreApp' {
  const CoreApp: import('react').ComponentType;
  export default CoreApp;
}

declare module 'strategic/StrategicApp' {
  const StrategicApp: import('react').ComponentType;
  export default StrategicApp;
}

declare module 'tactical/TacticalApp' {
  const TacticalApp: import('react').ComponentType;
  export default TacticalApp;
}

declare module 'npcs/NpcsApp' {
  const NpcsApp: import('react').ComponentType;
  export default NpcsApp;
}

declare module 'items/ItemsApp' {
  const ItemsApp: import('react').ComponentType;
  export default ItemsApp;
}

declare module 'spells/SpellsApp' {
  const SpellsApp: import('react').ComponentType;
  export default SpellsApp;
}
