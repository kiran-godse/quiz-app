#!/bin/bash

json_content=$(jq -c . < ./recipe/cmake/recipe.json)
package_kind=$(echo "$json_content" | jq .package.kind)
package_name=$(echo "$json_content" | jq .package.name)


echo "$package_kind"
echo "$package_name"
