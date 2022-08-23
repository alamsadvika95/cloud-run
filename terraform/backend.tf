terraform {
  backend "gcs" {
    bucket = "halogen-emblem-342714"
    prefix = "terraform/filestore-and-cloudsql/state"
  }
  #  backend "local" {
  #   path = "relative/path/to/terraform.tfstate"
  # }
}