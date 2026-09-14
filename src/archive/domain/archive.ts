import type { AtJsonObject } from "../../core/domain/json.types";

/**
 * Opaque application-level reference to an archived file.
 *
 * Consumers must not parse or construct archive keys. The archive service owns
 * their format so physical providers can change without leaking implementation
 * details to callers.
 */
export type ArchiveKey = string;

/**
 * Logical archive partition used by the application to route/group files.
 *
 * A bucket is not tied to an S3 bucket, filesystem directory, database, or any
 * other physical provider concept.
 */
export type ArchiveBucket = string;

/**
 * Provider-agnostic, JSON-safe metadata attached to an archived file.
 */
export type ArchiveMetadata = AtJsonObject;

/**
 * Optional content checksum exposed when an archive implementation can provide
 * one. The algorithm is intentionally open-ended so future providers are not
 * constrained to a fixed checksum list.
 */
export interface ArchiveChecksum {
    algorithm: string;
    value: string;
}

/**
 * Mutable descriptive properties of an archived file.
 *
 * Keeping these separate from physical content makes the same shape reusable
 * for upload and future metadata-update operations.
 */
export interface ArchiveFileProperties {
    title?: string;
    metadata?: ArchiveMetadata;
}

/**
 * Stable, provider-agnostic description of an archived file.
 *
 * Binary content is deliberately not part of this DTO. Browser File/Blob,
 * Node.js streams/buffers, HTTP responses, and provider-native handles belong
 * to their respective implementation layers.
 */
export interface ArchiveFileDescriptor extends ArchiveFileProperties {
    archiveKey: ArchiveKey;
    bucket: ArchiveBucket;
    fileName: string;
    mimeType?: string;
    size?: number;
    checksum?: ArchiveChecksum;
    version?: string;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Common options applied when one or more files are uploaded.
 *
 * File bytes and original filenames are transport-specific and intentionally
 * excluded from the shared contract.
 */
export interface ArchiveUploadOptions extends ArchiveFileProperties {
    bucket?: ArchiveBucket;
}

/**
 * Result of an archive upload operation.
 *
 * A collection is used because the canonical archive API supports uploading
 * one or many files in a single operation.
 */
export interface ArchiveUploadResult {
    files: ArchiveFileDescriptor[];
}
