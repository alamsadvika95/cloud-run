#!/bin/bash

for i in $(cat .env2)
do
  if [[ $i -gt 20]] 
  then
    echo "$i is greater than 20"
  else
    echo "$i is less than or equal to 20"
  fi
done 


# echo -n "Enter a number: "
# read VAR

# if [[ $VAR -gt 10 ]] 
# then
#   echo "The variable is greater than 10."
# elif [[ $VAR -lt 10 ]]
# then
#   echo "The variable is less than 10."
# else
#   echo "The variable is equal to 10."
# fi