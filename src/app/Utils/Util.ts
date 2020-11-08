export function upperCaseFirstLetter(input: string) {
  if (!input) { return; }
  return input.substring(0, 1).toLocaleUpperCase() + input.substring(1);
}
