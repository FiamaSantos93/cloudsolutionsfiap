provider "oci" {
  tenancy_ocid        = "ocid1.compartment.oc1..aaaaaaaamvtsqfa2lodnr65hx5j7dhm7hnrsx3bxftrtt6jldcdz6rcja7ga"  
  user_ocid           = "ocid1.user.oc1..aaaaaaaaerg3q3rkf57vcfzloxibl2ldcrqnxnihtjh23s3pd5haekov47aq"    
  fingerprint         = "64:8:df:a2:71:28:f0:04:0d:01:d6:60:e0:72:4a:b9" 
  private_key_path    = "/home/rm97885_20/.oci/oci_api_key.pem"
  region              = "sa-saopaulo-1"
}

#resource "oci_core_instance_action" "start_instance" {
#  instance_id = var.instance_ocid
#  action = "START"
#}

resource "null_resource" "webapp_setup" {
#  depends_on = [oci_core_instance_action.start_instance]

  connection {
    type        = "ssh"
    host        = 152.67.54.121
    user        = "opc"
    private_key = file("/home/rm97885_20/id_rsa")
  }

  provisioner "remote-exec" {
    inline = [
      "sudo yum install -y git httpd",
      "sudo systemctl start httpd",
      "sudo systemctl enable httpd",
      "git clone https://github.com/FiamaSantos93/cloudsolutionsfiap.git",
      "sudo mv cloudsolutionsfiap/* /var/www/html/",
      "sudo systemctl restart httpd"
    ]
  }
}
