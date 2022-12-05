  
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app

EXPOSE 80

#COPY webcalc-divide/ *.csproj ./
#COPY webcalc-divide.IntegrationTests/ *.csproj ./
#RUN dotnet restore

COPY . ../
WORKDIR /webcalc-divide
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /webcalc-divide
COPY --from=build-env /webcalc-divide/out .
ENTRYPOINT ["dotnet", "webcalc-divide.dll"]