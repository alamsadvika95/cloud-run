terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.12.0"
    }
  }
}

provider "google" {
  project   = var.project_id
  region    = var.region
  zone      = var.zone
}
provider "google-beta" {
  project   = var.project_id
  region    = var.region
  zone      = var.zone
}

resource "google_filestore_instance" "instance" {
  provider = google-beta
  name = "filestore-server"
  location = var.zone
  tier = "BASIC_HDD"

  file_shares {
    capacity_gb = 1024
    name        = "data"

    nfs_export_options {
      ip_ranges = ["10.184.0.0/24"]
      access_mode = "READ_WRITE"
      squash_mode = "NO_ROOT_SQUASH"
   }

   nfs_export_options {
      ip_ranges = ["10.128.0.0/24"]
      access_mode = "READ_WRITE"
      squash_mode = "NO_ROOT_SQUASH"
   }
  }

  networks {
    network = "default"
    modes   = ["MODE_IPV4"]
    connect_mode = "DIRECT_PEERING"
  }
}

resource "google_redis_instance" "redis" {
  name           = "redis-server"
  tier           = "STANDARD_HA"
  memory_size_gb = 1

  location_id             = var.zone
  alternative_location_id = var.zone_alternative

  authorized_network = data.google_compute_network.default-network.id

  redis_version     = "REDIS_4_0"
  display_name      = "Redis Instance"
  reserved_ip_range = "192.168.0.0/29"

  labels = {
    my_key    = "my_val"
    other_key = "other_val"
  }

  maintenance_policy {
    weekly_maintenance_window {
      day = "TUESDAY"
      start_time {
        hours = 0
        minutes = 30
        seconds = 0
        nanos = 0
      }
    }
  }
}
data "google_compute_network" "default-network" {
  name = "default"
}

resource "google_dns_managed_zone" "dev" {
  name     = "dev-zone"
  dns_name = "server.com."
  project  = var.project_id
  visibility = "private"
  private_visibility_config {
    networks {
      network_url = data.google_compute_network.default-network.id
    }
  }
}

resource "google_dns_record_set" "redis" {
  name = "redis.${google_dns_managed_zone.dev.dns_name}"
  type = "A"
  ttl  = 300

  managed_zone = google_dns_managed_zone.dev.name

  rrdatas = [google_redis_instance.redis.host]

  depends_on = [
    google_redis_instance.redis
  ]
}

resource "google_dns_record_set" "filestore" {
  name = "filestore.${google_dns_managed_zone.dev.dns_name}"
  type = "A"
  ttl  = 300

  managed_zone = google_dns_managed_zone.dev.name

  rrdatas = [google_filestore_instance.instance.networks[0].ip_addresses[0]]

  depends_on = [
    google_filestore_instance.instance
  ]
}

data "google_compute_instance" "sql" {
  name = "sql-server"
  zone = "us-central1-a"
}

resource "google_dns_record_set" "sql" {
  name = "sql.${google_dns_managed_zone.dev.dns_name}"
  type = "A"
  ttl  = 300

  managed_zone = google_dns_managed_zone.dev.name

  rrdatas = [data.google_compute_instance.sql.network_interface.0.network_ip]
}





