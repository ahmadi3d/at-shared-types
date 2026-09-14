import type { SnakeKeys } from "../../casing";
import type {
    ArchiveFileDescriptor,
    ArchiveUploadOptions,
} from "../domain";

/**
 * Wire representation of archive upload options.
 *
 * Only contract-owned top-level keys are normalized. User-defined metadata is
 * intentionally left untouched so an archive round-trip never rewrites its
 * keys. For multipart transports this describes the non-binary fields; file
 * content remains a transport concern.
 */
export type ArchiveUploadOptionsWireDto =
    SnakeKeys<ArchiveUploadOptions>;

/**
 * Wire representation of a provider-agnostic archive file descriptor.
 *
 * Shallow casing preserves opaque metadata exactly as the caller supplied it.
 */
export type ArchiveFileWireDto =
    SnakeKeys<ArchiveFileDescriptor>;

/**
 * Wire representation returned after uploading one or more files.
 */
export interface ArchiveUploadResultWireDto {
    files: ArchiveFileWireDto[];
}
