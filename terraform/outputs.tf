# Comprehensive Terraform Outputs for CI/CD Integration

# ============================================================================
# ECR (Elastic Container Registry)
# ============================================================================

output "ecr_repository_uri" {
  description = "ECR repository URI for pushing Docker images"
  value       = aws_ecr_repository.app.repository_url
}

output "ecr_repository_name" {
  description = "ECR repository name"
  value       = aws_ecr_repository.app.name
}

output "ecr_registry_id" {
  description = "ECR registry ID"
  value       = aws_ecr_repository.app.registry_id
}

# ============================================================================
# ECS (Elastic Container Service)
# ============================================================================

output "ecs_cluster_name" {
  description = "ECS cluster name for service deployment"
  value       = aws_ecs_cluster.main.name
}

output "ecs_cluster_arn" {
  description = "ECS cluster ARN"
  value       = aws_ecs_cluster.main.arn
}

output "ecs_service_name" {
  description = "ECS service name for updates"
  value       = aws_ecs_service.app.name
}

output "ecs_service_arn" {
  description = "ECS service ARN"
  value       = aws_ecs_service.app.id
}

output "ecs_task_definition_family" {
  description = "ECS task definition family name"
  value       = aws_ecs_task_definition.app.family
}

output "ecs_task_execution_role_arn" {
  description = "ECS task execution role ARN"
  value       = aws_iam_role.ecs_task_execution.arn
}

output "ecs_task_role_arn" {
  description = "ECS task role ARN (for application permissions)"
  value       = aws_iam_role.ecs_task.arn
}

# ============================================================================
# ALB (Application Load Balancer)
# ============================================================================

output "alb_dns_name" {
  description = "ALB DNS name - use this for initial testing"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "ALB Route53 zone ID for DNS alias records"
  value       = aws_lb.main.zone_id
}

output "alb_arn" {
  description = "ALB ARN"
  value       = aws_lb.main.arn
}

output "alb_http_listener_arn" {
  description = "ALB HTTP listener ARN (redirects to HTTPS)"
  value       = aws_lb_listener.http.arn
}

output "alb_https_listener_arn" {
  description = "ALB HTTPS listener ARN"
  value       = aws_lb_listener.https.arn
}

output "alb_target_group_arn" {
  description = "ALB target group ARN"
  value       = aws_lb_target_group.app.arn
}

output "alb_target_group_name" {
  description = "ALB target group name"
  value       = aws_lb_target_group.app.name
}

# ============================================================================
# Secrets Manager - ARNs for ECS Task Definition
# ============================================================================

output "secrets_database_arn" {
  description = "Secrets Manager ARN for database credentials"
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "secrets_redis_arn" {
  description = "Secrets Manager ARN for Redis credentials"
  value       = aws_secretsmanager_secret.redis_credentials.arn
}

output "secrets_paystack_public_key" {
  description = "Secret name for Paystack public key (must be created manually)"
  value       = "owambe/paystack/public_key"
}

output "secrets_paystack_secret_key" {
  description = "Secret name for Paystack secret key (must be created manually)"
  value       = "owambe/paystack/secret_key"
}

output "secrets_termii_api_key" {
  description = "Secret name for Termii API key (must be created manually)"
  value       = "owambe/termii/api_key"
}

output "secrets_termii_sender_id" {
  description = "Secret name for Termii sender ID (must be created manually)"
  value       = "owambe/termii/sender_id"
}

output "secrets_jwt_secret" {
  description = "Secret name for JWT secret (must be created manually)"
  value       = "owambe/jwt_secret"
}

output "secrets_ses_sender" {
  description = "Secret name for SES sender email (must be created manually)"
  value       = "owambe/email/ses_sender"
}

# ============================================================================
# Database (RDS MySQL)
# ============================================================================

output "rds_endpoint" {
  description = "RDS MySQL endpoint (host:port)"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "rds_address" {
  description = "RDS MySQL address (hostname only)"
  value       = aws_db_instance.main.address
}

output "rds_port" {
  description = "RDS MySQL port"
  value       = aws_db_instance.main.port
}

output "rds_database_name" {
  description = "RDS database name"
  value       = aws_db_instance.main.db_name
}

output "rds_username" {
  description = "RDS master username"
  value       = aws_db_instance.main.username
  sensitive   = true
}

# ============================================================================
# Cache (ElastiCache Redis)
# ============================================================================

output "redis_primary_endpoint" {
  description = "Redis primary endpoint address"
  value       = aws_elasticache_replication_group.main.primary_endpoint_address
}

output "redis_reader_endpoint" {
  description = "Redis reader endpoint address"
  value       = aws_elasticache_replication_group.main.reader_endpoint_address
}

output "redis_port" {
  description = "Redis port"
  value       = aws_elasticache_replication_group.main.port
}

# ============================================================================
# Storage (S3 + CloudFront)
# ============================================================================

output "s3_bucket_name" {
  description = "S3 bucket name for application storage"
  value       = aws_s3_bucket.storage.id
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.storage.arn
}

output "s3_bucket_regional_domain" {
  description = "S3 bucket regional domain name"
  value       = aws_s3_bucket.storage.bucket_regional_domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.storage.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.storage.domain_name
}

# ============================================================================
# SSL/TLS Certificate
# ============================================================================

output "acm_certificate_arn" {
  description = "ACM certificate ARN for HTTPS"
  value       = aws_acm_certificate.main.arn
}

output "acm_certificate_domain" {
  description = "ACM certificate domain name"
  value       = aws_acm_certificate.main.domain_name
}

output "acm_certificate_validation_options" {
  description = "ACM certificate DNS validation records"
  value       = aws_acm_certificate.main.domain_validation_options
}

# ============================================================================
# Networking
# ============================================================================

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "vpc_cidr" {
  description = "VPC CIDR block"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "nat_gateway_ips" {
  description = "NAT Gateway public IPs"
  value       = aws_eip.nat[*].public_ip
}

# ============================================================================
# Security Groups
# ============================================================================

output "alb_security_group_id" {
  description = "ALB security group ID"
  value       = aws_security_group.alb.id
}

output "ecs_security_group_id" {
  description = "ECS tasks security group ID"
  value       = aws_security_group.ecs_tasks.id
}

output "rds_security_group_id" {
  description = "RDS security group ID"
  value       = aws_security_group.rds.id
}

output "redis_security_group_id" {
  description = "Redis security group ID"
  value       = aws_security_group.redis.id
}

# ============================================================================
# Monitoring & Alerts
# ============================================================================

output "sns_alerts_topic_arn" {
  description = "SNS topic ARN for alerts"
  value       = aws_sns_topic.alerts.arn
}

output "cloudwatch_log_group_name" {
  description = "CloudWatch log group name for ECS"
  value       = aws_cloudwatch_log_group.ecs.name
}

output "cloudwatch_dashboard_url" {
  description = "CloudWatch dashboard URL"
  value       = "https://${var.aws_region}.console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=${aws_cloudwatch_dashboard.main.dashboard_name}"
}

# ============================================================================
# CI/CD Integration Summary
# ============================================================================

output "cicd_integration_summary" {
  description = "Summary of key values for CI/CD pipeline configuration"
  value = {
    # Container Registry
    ecr_repository_uri = aws_ecr_repository.app.repository_url
    ecr_registry_id    = aws_ecr_repository.app.registry_id
    
    # ECS Deployment
    ecs_cluster_name           = aws_ecs_cluster.main.name
    ecs_service_name           = aws_ecs_service.app.name
    ecs_task_definition_family = aws_ecs_task_definition.app.family
    
    # Load Balancer
    alb_dns_name          = aws_lb.main.dns_name
    alb_target_group_name = aws_lb_target_group.app.name
    
    # Secrets (must be created before deployment)
    required_secrets = [
      "owambe/paystack/public_key",
      "owambe/paystack/secret_key",
      "owambe/termii/api_key",
      "owambe/termii/sender_id",
      "owambe/jwt_secret",
      "owambe/email/ses_sender"
    ]
    
    # Auto-created secrets
    auto_created_secrets = [
      aws_secretsmanager_secret.db_credentials.name,
      aws_secretsmanager_secret.redis_credentials.name
    ]
  }
}

# ============================================================================
# Quick Start Commands
# ============================================================================

output "quick_start_commands" {
  description = "Quick start commands for deployment"
  value = <<-EOT
    # 1. Authenticate with ECR
    aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${aws_ecr_repository.app.repository_url}
    
    # 2. Build and push Docker image
    docker build -t ${aws_ecr_repository.app.repository_url}:latest .
    docker push ${aws_ecr_repository.app.repository_url}:latest
    
    # 3. Update ECS service
    aws ecs update-service --cluster ${aws_ecs_cluster.main.name} --service ${aws_ecs_service.app.name} --force-new-deployment --region ${var.aws_region}
    
    # 4. Check deployment status
    aws ecs describe-services --cluster ${aws_ecs_cluster.main.name} --services ${aws_ecs_service.app.name} --region ${var.aws_region}
    
    # 5. View logs
    aws logs tail /ecs/${var.app_name} --follow --region ${var.aws_region}
    
    # 6. Access application
    curl https://${aws_lb.main.dns_name}/health
  EOT
}
