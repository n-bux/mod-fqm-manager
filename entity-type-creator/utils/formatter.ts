import { DataType, EntityType, EntityTypeField } from '@/types';

function preferredOrder<T extends object>(obj: T, order: (keyof T)[]) {
  const newObject: Partial<T> = {};
  for (var i = 0; i < order.length; i++) {
    if (obj.hasOwnProperty(order[i]) && obj[order[i]] !== undefined) {
      newObject[order[i]] = obj[order[i]];
    }
  }
  return newObject as T;
}

function serializeSqlForTenantTemplating(sql: string | undefined) {
  if (sql) {
    return sql.replaceAll('TENANT_', '${tenant_id}_');
  }
  return sql;
}

// desired root key order
const desiredRootKeyOrder = [
  'id',
  'name',
  'root',
  'private',
  'customFieldEntityTypeId',
  'fromClause',
  'columns',
  'defaultSort',
  'sourceView',
  'sourceViewExtractor',
] as (keyof EntityType)[];
const desiredDefaultSortKeyOrder = ['columnName', 'direction'] as (keyof Required<EntityType>['defaultSort'][0])[];
const desiredFieldKeyOrder = [
  'name',
  'dataType',
  'isIdColumn',
  'idColumnName',
  'queryable',
  'visibleByDefault',
  'valueGetter',
  'filterValueGetter',
  'valueFunction',
  'source',
  'valueSourceApi',
  'values',
] as (keyof EntityTypeField)[];
const desiredDataTypeKeyOrder = ['dataType', 'itemDataType', 'properties'] as (keyof DataType)[];

function fixField(field: EntityTypeField) {
  field.dataType = preferredOrder(field.dataType, desiredDataTypeKeyOrder);

  field.valueGetter = serializeSqlForTenantTemplating(field.valueGetter);
  field.filterValueGetter = serializeSqlForTenantTemplating(field.filterValueGetter);
  field.valueFunction = serializeSqlForTenantTemplating(field.valueFunction);

  if (Array.isArray(field.dataType?.properties)) {
    field.dataType.properties = field.dataType.properties.map(fixField);
  }

  return preferredOrder<EntityTypeField>(field, desiredFieldKeyOrder);
}

export default function formatEntityType(data: EntityType) {
  data.columns = data.columns?.map(fixField);
  data.fromClause = serializeSqlForTenantTemplating(data.fromClause);
  if (data.defaultSort) {
    data.defaultSort = data.defaultSort.map((s) => preferredOrder(s, desiredDefaultSortKeyOrder));
  }
  data = preferredOrder(data, desiredRootKeyOrder);

  return data;
}
