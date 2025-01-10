import { JSONNode, JSONValue } from '../types/json'
import { faker } from '@faker-js/faker'

export function generateSyntheticData(node: JSONNode): JSONValue {
  if (!node || typeof node !== 'object') return null;

  switch (node.type) {
    case 'object':
      return generateObject(node)
    case 'array':
      return generateArray(node)
    case 'string':
      return faker.lorem.word()
    case 'number':
      return faker.number.int({ min: 0, max: 1000 })
    case 'boolean':
      return faker.datatype.boolean()
    case 'null':
      return null
    default:
      return null
  }
}

function generateObject(node: JSONNode): JSONValue {
  if (!node.value || typeof node.value !== 'object') return {};

  const result: Record<string, JSONValue> = {}
  Object.entries(node.value).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && 'type' in value) {
      result[key] = generateSyntheticData(value as JSONNode)
    } else {
      result[key] = value
    }
  })
  return result
}

function generateArray(node: JSONNode): JSONValue[] {
  if (!Array.isArray(node.value)) return [];

  const arrayNode = node.value as JSONNode[]
  if (arrayNode.length === 0) return []
  
  const count = node.arrayCount || 1
  return Array.from({ length: count }, () => 
    generateSyntheticData(arrayNode[0])
  )
}

