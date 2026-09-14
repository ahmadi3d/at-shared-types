import type { AtJsonObject } from "../../core/domain/json.types";

/**
 * Stable application-level identity of an archived file.
 *
 * Archive IDs are the only durable identity business data should persist.
 * They must remain stable when file content moves between physical archive
 * providers. Consumers must not derive provider, database, path, or bucket
 * information from an archive ID.
 */
export type ArchiveId = string;

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
 * Encoding used for checksum values exposed through JSON contracts.
 *
 * Binary checksum bytes must never be coerced directly into text.
 */
export type ArchiveChecksumEncoding = "hex" | "base64";

/**
 * Optional content checksum exposed when the archive implementation can
 * provide one.
 *
 * The algorithm remains open-ended so future implementations are not limited
 * to a hard-coded algorithm list. The value must use the declared text
 * encoding.
 */
export interface ArchiveChecksum {
    algorithm: string;
    encoding: ArchiveChecksumEncoding;
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
 * Lightweight durable reference intended for business records, forms,
 * workflows, and other application data that points at an archived file.
 *
 * archiveId is the identity. The remaining fields are a small display snapshot
 * so common UIs can render a filename/type/size without issuing an archive
 * metadata request for every reference. Archive-owned metadata such as bucket,
 * checksum, version, title, custom metadata, and timestamps deliberately does
 * not belong here.
 */
export interface ArchiveFileReference {
    archiveId: ArchiveId;
    fileName: string;
    mimeType?: string;
    size?: number;
}

/**
 * Complete provider-agnostic description of an archived file.
 *
 * Binary content and physical location are deliberately absent. Browser
 * File/Blob, Node.js streams/buffers, HTTP responses, database IDs, filesystem
 * paths, and provider-native handles belong to implementation layers.
 */
export interface ArchiveFileDescriptor extends ArchiveFileProperties {
    archiveId: ArchiveId;
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
