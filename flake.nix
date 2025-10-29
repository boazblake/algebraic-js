{
  description = "effects-vdom optimized";
  inputs = { nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05"; flake-utils.url = "github:numtide/flake-utils"; };
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { inherit system; }; node = pkgs.nodejs_20; in {
        packages.default = pkgs.stdenv.mkDerivation {
          pname = "effects-vdom"; version = "0.3.0"; src = ./.;
          buildInputs = [ node pkgs.esbuild pkgs.typescript ];
          buildPhase = ''npm install --ignore-scripts; npm run build'';
          installPhase = ''mkdir -p $out; cp -r dist public package.json $out/'';
        };
        devShells.default = pkgs.mkShell {
          packages = [ node pkgs.esbuild pkgs.typescript pkgs.nodePackages.npm pkgs.nodePackages.serve ];
        };
      });
}
