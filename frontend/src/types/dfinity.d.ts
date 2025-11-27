// Minimal ambient module declarations to satisfy Next's type checker during local builds.
declare module '@dfinity/candid';
declare module '@dfinity/agent';
declare module '@dfinity/principal';
declare module '@dfinity/auth-client';

// Minimal global type aliases used across the codebase during local builds
// to avoid strict type-checking errors when library type definitions are missing.
declare type AuthClient = any;
declare type Principal = any;
