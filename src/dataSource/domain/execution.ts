/**
 * Runtime result of executing a DataSource.
 *
 * - raw: provider-native result.
 * - sourceValue: canonical provider value before DataSource transforms.
 * - value: final value after DataSource transforms.
 *
 * This type describes runtime execution data only. It is not part of the
 * persisted DataSourceBinding JSON contract.
 */
export interface DataSourceExecutionResult<
    TRaw = unknown,
    TSourceValue = unknown,
    TValue = unknown
> {
    raw: TRaw;
    sourceValue: TSourceValue;
    value: TValue;
}
