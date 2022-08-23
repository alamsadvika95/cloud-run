variable "project_id" {
 description = "The project ID to host the cluster in"
 default   ="halogen-emblem-342714"
}
variable "region" {
 description = "The region to host the cluster in"
 default   ="us-central1"
}
variable "zone" {
 description = "The zoneto host the cluster in"
 default   ="us-central1-a"
}
variable "zone_alternative" {
 description = "The zoneto host the cluster in"
 default   ="us-central1-b"
}