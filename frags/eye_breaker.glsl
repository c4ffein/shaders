void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalize coordinates to [-1, 1] range
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    // Calculate distance from center
    float dist = length(uv);

    // Create animated rings
    float rings = sin(dist * 10.0 - iTime * 9.0) * 0.5 + 0.5;

    // Create RGB color channels with different frequencies
    vec3 color = vec3(
        sin(rings * 3.14159 + iTime * 2.0 + 2.0) * 0.5 + sin(rings * 3.14159 + iTime) * 0.5 + 1.0,
        sin(rings * 3.14159 + iTime * 2.0 + 2.0) * 0.5 + 0.3,
        sin(rings * 3.14159 + iTime * 2.0 + 2.0) * 0.5 + 0.3
    );

    // Add radial gradient
    color *= (1.0 - dist * 0.8);

    // Output the color
    fragColor = vec4(color, 1.0);
}
